import { SearchOutlined } from "@ant-design/icons";
import { RouteComponentProps } from "@reach/router"
import { Button, Input, message, notification, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react"
import { getDB } from "../../../config/db";
import { Roles } from "../../../models/User.model";
import Highlighter from "react-highlight-words";
const roleOptions = [{ value: Roles.ADMIN }, { value: Roles.MODERATOR }, { value: Roles.READER }];

const UserController: React.FC<RouteComponentProps | any> = () => {
    const [userList, setUserList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState<Input | null>(null);
    const [searchText, setSearchText] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState<any>(null);
    const [pagination, setPagination] = useState({
        current: 1, pageSize: 10, total: 0, pageSizeOptions: ["10", "25", "50"],
        showSizeChanger: true,
        locale: { items_per_page: "" }
    });
    useEffect(() => {
        setLoading(true);
        getDB('auth')?.collection('users').aggregate([{
            "$facet": {
                "totalData": [
                    { "$match": searchText ? { email: new RegExp(searchText, 'i') } : {} },
                    { "$skip": pagination.current > 1 ? ((pagination.current - 1) * pagination.pageSize) : 0 },
                    { "$limit": pagination.pageSize }
                ],
                "matchCount": [
                    { "$group": { _id: { source: "$source", status: "$status" }, count: { $sum: 1 } } },
                ],
                "totalCount": [
                    { "$count": "count" }
                ]
            }
        }]).then((data) => {
            setUserList(data[0].totalData);
            setPagination(p => ({
                ...p,
                total: data[0].matchCount[0].count
            }));
        }).finally(() => setLoading(false));

    }, [pagination.pageSize, pagination.current, searchText])

    function handleRoleChange(value: string, user) {
        const hide = message.loading('Action in progress..', 0);
        getDB('auth')?.collection('users').updateOne({ id: user.id }, { $set: { role: value } }).then(() => {
            notification['success']({
                message: 'Success',
                placement: 'bottomRight',
                description:
                    `${user.name} role updated to ${value.toLowerCase()}`,
            });
        }).finally(() => { setTimeout(hide, 0) }).catch((err) => {
            notification['error']({
                placement: 'bottomRight',
                message: err.errorCodeName,
                description: err.message,
            });
        })
    }
    function handleDeleteUser(user) {
        const hide = message.loading('Action in progress..', 0);
        getDB('auth')?.collection('users').deleteOne({ id: user.id }).then(() => {
            // fetchUserList(pagination);
            notification['success']({
                message: 'Success',
                placement: 'bottomRight',
                description:
                    `${user.name} deleted!`,
            });
        }).finally(() => { setTimeout(hide, 0) }).catch((err) => {
            notification['error']({
                placement: 'bottomRight',
                message: err.errorCodeName,
                description: err.message,
            });
        })
    }
    function handleSearch(selectedKeys, confirm, dataIndex) {
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        confirm();
    };
    function handleReset(clearFilters) {
        clearFilters();
        setSearchText('');
        // fetchUserList({ ...pagination, current: 1 });
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        setSearchInput(node);
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
              </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput?.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                    text
                ),
    });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            render: (text: string, user) =>
                <Select
                    onChange={(newRole) => handleRoleChange(newRole, user)}
                    showArrow
                    defaultValue={text}
                    style={{ width: 200 }}
                    options={roleOptions}
                />

        },
        {
            title: 'Action',
            key: 'action',
            render: (_, user) => (
                <Space size="middle">
                    <Button onClick={() => handleDeleteUser(user)} type="primary" danger>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table onChange={
                (newPage: any) => setPagination({
                    ...pagination,
                    current: newPage.current,
                    pageSize: newPage.pageSize,
                })
            } pagination={pagination}
                style={{ marginTop: 20 }} loading={loading} columns={columns} dataSource={userList} />
        </div>
    )
}

export default UserController
