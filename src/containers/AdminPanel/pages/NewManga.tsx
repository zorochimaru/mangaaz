import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { RouteComponentProps } from "@reach/router"
import { message, Upload, Form, Input, Button, Select, Row, Col, notification } from "antd"
import ImgCrop from 'antd-img-crop'
import TextArea from "antd/lib/input/TextArea";
import { Option } from "antd/lib/mentions";
import { BSON } from "mongodb-stitch-browser-sdk";
import React, { useRef, useState } from "react";
import * as db from '../../../config/db';
import { Manga } from "../../../models/Manga.model";
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 16, span: 12 },
};
const NewManga: React.FC<RouteComponentProps | any> = () => {
  const [manga, setManga] = useState<any>(null);
  const [errors, setErrors] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [genresLibrary, setGenresLibrary] = useState<any[]>([]);
  const [main] = Form.useForm();
  const inputFileRef = useRef<any>(null);


  const handleBtnClick = () => {
    inputFileRef.current && inputFileRef.current.click();
  }

  function getBase64(img: any) {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
      reader.readAsDataURL(img);
    })
  }
  const handleCoverChange = (info: any) => {

    setCoverLoading(true);
    getBase64(info.target.files[0]).then((stringImg) => {
      setCoverUrl(stringImg);
      setCoverLoading(false);
    });

  }
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  const handleSearch = (value: string) => {
    if (value) {
      setLoading(true);
      db.getDB('option-library')
        .collection('genres').find({ 'value': { $regex: `.*${value}.*` } }).asArray().then((mangaList: any) => {
          setLoading(false);
          setGenresLibrary(mangaList)
        }).catch((err: any) => {
          setLoading(false);
          console.log(err);
        }
        )
    } else {
      setGenresLibrary([]);
    }
  };
  const uploadButton = (
    <div style={{
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
    }} onClick={handleBtnClick}>
      {coverLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload cover</div>
    </div>
  );
  const onFinish = (values: any) => {


    const newManga: Manga = {
      _id: new BSON.ObjectId(),
      author: values.author,
      coverUrl: coverUrl,
      description: values.description,
      genres: values.genres,
      title: values.title
    }

    const hide = message.loading('Action in progress..', 0);



    db.getDB('manga-library')
      .collection('titles').insertOne(newManga).finally(() => {
        setTimeout(hide, 0);
        notification['success']({
          message: 'Success',
          placement: 'bottomRight',
          description:
            'Manga added!',
        });
      }).catch((error) => {

        console.log(error);
        error.map((error: any) => {
          notification['error']({
            placement: 'bottomRight',
            message: error.name.join(', '),
            description: error.errors.join(', '),
          });
        });
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    errorInfo.errorFields.map((error: any) => {
      notification['error']({
        placement: 'bottomRight',
        message: error.name.join(', '),
        description: error.errors.join(', '),
      });
    });



  };
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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
                notFoundContent={null}
                onSearch={handleSearch}
                mode="multiple"
                allowClear

                style={{ width: '100%' }}
              >
                {genresLibrary.map(genre => (
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

export default NewManga
