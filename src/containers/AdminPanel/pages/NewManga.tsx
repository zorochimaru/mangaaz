import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { RouteComponentProps } from "@reach/router"
import { message, Form, Input, Button, Select, Row, Col, notification, Divider, Empty } from "antd"
import TextArea from "antd/lib/input/TextArea";
import { Option } from "antd/lib/mentions";
import imageCompression from "browser-image-compression";
import React, { CSSProperties, useRef, useState } from "react";
import { BSON } from "realm-web";
import * as db from '../../../config/db';
import { Manga } from "../../../models/Manga.model";

/* 
TODOS
////////////////////////////////
Add genre function (_id/value - standart will be lowercase)

////////////////////////////////
*/
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 16, span: 12 },
};

const NewManga: React.FC<RouteComponentProps | any> = () => {
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [genresList, setGenresList] = useState<any[]>([]);
  const [newGenreName, setNewGenreName] = useState<string>('');
  const [main] = Form.useForm();
  const inputFileRef = useRef<HTMLInputElement>(null);


  const uploadButton = (
    <div style={styles.addCoverButton}
      onClick={handleBtnClick}>
      {coverLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload cover</div>
    </div>
  );

  function handleBtnClick() {
    inputFileRef.current && inputFileRef.current.click();
  }



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

  const handleCoverChange = (event: any) => {
    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
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
    // TODO: maybe add input for adding genre
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

  const onFinish = (values: any) => {
    // set loading
    const hide = message.loading('Action in progress..', 0);
    // create object
    const newManga: Manga = {
      _id: new BSON.ObjectId(),
      author: values.author,
      coverUrl: coverUrl,
      description: values.description,
      genres: values.genres,
      title: values.title,
      ownerId: db.RealmApp.currentUser?.customData.id
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


return (
  <div>
    <Form
      form={main}
      {...layout}
      style={{ width: '100%' }}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row style={{ marginTop: 20 }}>
        <Col span={16}>

          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Author"
            name="author"
            rules={[{ required: true, message: 'Please input author name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Genres"
            name="genres"
            rules={[{ required: true, message: 'Please input genres!' }]}
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
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
              </Button>
          </Form.Item>

        </Col>
        <Col span={8}>
          {coverUrl ? <img src={coverUrl}
            onClick={handleBtnClick}
            alt="cover"
            style={{
              height: 300,
              objectFit: 'cover',
              border: '4px solid #fff',
              boxShadow: '3px 6px 20px -7px rgba(0,0,0,0.75)'
            }} /> : uploadButton}

          <Form.Item

            name="coverUrl"
            rules={[{ required: true, message: 'Please upload cover!' }]} >

            <input
              type="file"
              ref={inputFileRef}
              onChange={handleCoverChange}
              hidden
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </div>
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

export default NewManga
