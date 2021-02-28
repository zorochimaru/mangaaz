import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons"
import { RouteComponentProps } from "@reach/router"
import { message, Form, Input, Button, Select, Row, Col, notification, Divider, Empty, Upload, Drawer, Card, Image, Popconfirm, Space } from "antd"
import ImgCrop from "antd-img-crop";
import Search from "antd/lib/input/Search";
import TextArea from "antd/lib/input/TextArea";
import { Option } from "antd/lib/mentions";
import imageCompression from "browser-image-compression";
import React, { CSSProperties, useState } from "react";
import { BSON } from "realm-web";
import * as db from '../../../../config/db';
import { Manga } from "../../../../models/Manga.model";


/* 
TODOS
////////////////////////////////
Add genre function (_id/value - standart will be lowercase)
Disable form on submit
////////////////////////////////
*/
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};


const MangaController: React.FC<RouteComponentProps | any> = () => {
  const [coverLoading, setCoverLoading] = useState(false);
  const [fileList, setFileList] = useState<any>([]);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [genresList, setGenresList] = useState<any[]>([]);
  const [newGenreName, setNewGenreName] = useState<string>('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searching, setSearching] = useState(false);
  const [editItem, setEditItem] = useState<Manga | null>(null);
  const [searchList, setSearchList] = useState<Manga[]>([]);
  const [main] = Form.useForm();
  const [searchForm] = Form.useForm();
  const dummyRequest: any = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const showDrawer = () => {
    setShowSearchBar(true);
  };
  const onClose = () => {
    setShowSearchBar(false);
  };
  const uploadButton = (
    <div style={styles.addCoverButton}>
      {coverLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Üzlük yükləyin</div>
    </div>
  );

  function getBase64(img: any) {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
      reader.addEventListener('error', () => {
        reject(reader.result);
      });
      reader.readAsDataURL(img);
    })
  }
  function handleEditManga(manga: Manga) {
    onClose();
    setEditItem(manga);
    main.resetFields();
    main.setFieldsValue(manga);
    setCoverUrl(manga.coverUrl);
  }
  const addNewGenreName = () => {
    if (!genresList.some(genre => genre.value.toLocaleLowerCase() === newGenreName?.toLocaleLowerCase())) {
      const hide = message.loading('Adding new genre to library...', 0);
      db.getDB('options-library')
        ?.collection('genres').insertOne({ _id: new BSON.ObjectId(), value: newGenreName?.toLocaleLowerCase() }).finally(() => {
          setTimeout(hide, 0)
        })
        .then(() => {
          handleSearch(newGenreName);
          setNewGenreName('');
        }).catch((err) => {
          notification['error']({
            placement: 'bottomRight',
            message: err.errorCodeName,
            description: err.message,
          });
        })

    }
  }

  const handleCoverChange = (imageFile: any) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    if (!imageFile.type.includes('image/')) {
      message.error(`${imageFile.name} is not a image file`);
      return
    }
    setCoverLoading(true);
    imageCompression(imageFile, options).then((compressedImage) => {
      getBase64(compressedImage).then((stringImg) => {
        setCoverUrl(stringImg);
        setCoverLoading(false);
      }).catch((err) => {
        notification['error']({
          placement: 'bottomRight',
          message: err.errorCodeName,
          description: err.message,
        });
      });
    })
  }

  function handleSearch(value: string) {
    if (value) {
      db.getDB('options-library')
        ?.collection('genres').find({ 'value': new RegExp(value, 'i') }).then((genres: any) => {
          setGenresList(genres)
        }).catch((err: any) => {
          notification['error']({
            placement: 'bottomRight',
            message: err.errorCodeName,
            description: err.message,
          });
        }
        )
    } else {
      setGenresList([]);
    }
  };

  const onSave = (values: any) => {
    if (!coverUrl) {

      notification['error']({
        placement: 'bottomRight',
        message: 'Ooops',
        description: 'Cover is requied',
      });
      return
    }
    // set loading
    const hide = message.loading('Fəaliyyət davam edir...', 0);
    if (!editItem) {
      // create object
      const newManga: Manga = {
        _id: new BSON.ObjectId(),
        author: values.author,
        coverUrl: coverUrl,
        description: values.description,
        genres: values.genres,
        title: values.title,
        ownerId: db.RealmApp.currentUser?.customData.id,
        rating: 0,
        chaptersCount: 0
      };
      // save to DB
      db.getDB('manga-library')
        ?.collection('titles').insertOne(newManga).then(() => {
          notification['success']({
            message: 'Success',
            placement: 'bottomRight',
            description:
              'Manga added!',
          });
          main.resetFields();
          setCoverUrl('');
        }).finally(() => setTimeout(hide, 0)).catch((error) => {
          notification['error']({
            placement: 'bottomRight',
            message: error.errorCodeName,
            description: error.message,
          });

        });

    }
    else {
      db.getDB('manga-library')
        ?.collection('titles').updateOne({ _id: editItem?._id }, { ...editItem, ...main.getFieldsValue() })
        .then(() => {
          notification['success']({
            message: 'Success',
            placement: 'bottomRight',
            description:
              'Manga edited!',
          });
          setEditItem(null);
          setSearchList([]);
          main.resetFields();
          setCoverUrl('');
          searchForm.resetFields();
        })
        .finally(() => setTimeout(hide, 0)).catch((error) => {
          notification['error']({
            placement: 'bottomRight',
            message: error.errorCodeName,
            description: error.message,
          });
        });
    }
  };


  const onFinishFailed = (errorInfo: any) => {

    errorInfo.errorFields.forEach((error: any) => {
      notification['error']({
        placement: 'bottomRight',
        message: error.name.join(', '),
        description: error.errors.join(', '),
      });
    });

  };
  function onSearchTitles(values: any) {
    setSearching(true);
    db.getDB('manga-library')
      ?.collection('titles')
      .find({ title: new RegExp(values.title, 'i') })
      .then((mangaList: Manga[]) => {
        setSearchList(mangaList);
      }).finally(() => setSearching(false));
  }
  function handleupload(file) {
    setFileList([]);
    handleCoverChange(file);
    return true
  }
  function handleDeleteManga(manga: Manga) {

    const hide = message.loading('Fəaliyyət davam edir...', 0);
    db.getDB('manga-library')
      ?.collection('titles').deleteOne({ _id: manga._id })
      .then(() => {
        notification['success']({
          message: 'Success',
          placement: 'bottomRight',
          description:
            'Manga deleted!',
        });
        setSearchList((list) => list.filter(item => item !== manga));
      })
      .finally(() => setTimeout(hide, 0))
      .catch((error) => {
        notification['error']({
          placement: 'bottomRight',
          message: error.errorCodeName,
          description: error.message,
        });
      });
  }
  return (
    <div>
      <Form
        form={main}
        {...layout}
        style={{ width: '100%' }}
        name="basic"
        onFinish={onSave}
        onFinishFailed={onFinishFailed}
      >
        <Row style={{ marginTop: 20 }}>
          <Col span={12}>

            <Form.Item
              label="Başlıq"
              name="title"
              rules={[{ required: true, message: 'Başlığı daxil edin!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Müəllif"
              name="author"
              rules={[{ required: true, message: 'Müəllif adını daxil edin!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Janrlar"
              name="genres"
              rules={[{ required: true, message: 'Janrları daxil edin!' }]}
            >
              <Select
                showSearch
                filterOption={false}
                notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                onSearch={handleSearch}
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                      <Input style={{ flex: 'auto' }} type="text" value={newGenreName} onChange={(e) => setNewGenreName(e.target.value)} />
                      <Button type="link" disabled={!newGenreName} onClick={addNewGenreName}><PlusOutlined />Add genre</Button>
                    </div>
                  </div>
                )}
              >
                {genresList.map(genre => (
                  <Option key={genre.value} >{genre.value}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Təsvir"
              name="description"
              rules={[{ required: true, message: 'Təsviri daxil edin!' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              <Button type="primary" icon={<SearchOutlined />} onClick={showDrawer}>
                Manqanı axtar
              </Button>

              <Form.Item  >
                <Button type="primary" icon={<UploadOutlined />} htmlType="submit">
                  Manqanı yadda saxla
              </Button>
              </Form.Item>
            </div>


          </Col>
          <Col span={8}>
            <ImgCrop aspect={5 / 7.8}>
              <Upload
                fileList={fileList}
                customRequest={dummyRequest}
                beforeUpload={(file) => handleupload(file)}
              >
                {coverUrl ? <img src={coverUrl}
                  alt="cover"
                  style={{
                    cursor: 'pointer',
                    height: 300,
                    objectFit: 'cover',
                    border: '4px solid #fff',
                    boxShadow: '3px 6px 20px -7px rgba(0,0,0,0.75)'
                  }} /> : uploadButton}

              </Upload>
            </ImgCrop>
          </Col>

        </Row>
      </Form>
      <Drawer
        width={460}
        title={
          <Form
            form={searchForm}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onSearchTitles}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="title"
              rules={[{ required: true, message: 'Başlığı daxil edin!' }]}
            >
              <Search placeholder="input title" enterButton="Search" size="large" onSearch={searchForm.submit} loading={searching} />
            </Form.Item>
          </Form>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        visible={showSearchBar}
      >

        <Space direction="vertical" style={{ width: '100%' }}>
          {searchList.map((manga: Manga) => {
            return (
              <Card

                key={manga.title}
                title={manga.title}
                actions={[
                  <EditOutlined onClick={() => { handleEditManga(manga) }} key="edit" />,
                  <Popconfirm
                    placement="bottom"
                    title={'Silmək istədiyinizə əminsinizmi?'}
                    onConfirm={() => handleDeleteManga(manga)}
                    okText="Bəli"
                    cancelText="Yox"
                  >
                    <DeleteOutlined style={{ color: 'red' }} key="delete" />
                  </Popconfirm>
                ]}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p><strong>Müəllif: </strong>{manga.author}</p>
                    <p><strong>Təsvir: </strong><br />{manga.description}</p>
                  </div>
                  <Image
                    width={80}
                    src={manga.coverUrl}
                  />

                </div>
              </Card>
            )
          })}
        </Space>
      </Drawer>
    </div >
  )
}


const styles: { [key: string]: CSSProperties } = {
  addCoverButton: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 300,
    objectFit: 'cover',
    border: '4px solid #fff',
    boxShadow: '3px 6px 20px -7px rgba(0,0,0,0.75)'
  }
}

export default MangaController
