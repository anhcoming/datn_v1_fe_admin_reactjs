import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import AxiosApi from '../../api/AxiosApi'
import WsMessage from '../../utils/constants/WsMessage'
import WsToastType from '../../utils/constants/WsToastType'
import ToastUtils from '../../utils/ToastUtils'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import WsUrl from '../../utils/constants/WsUrl'
import Select from 'react-select'
import { Link } from 'react-router-dom'


// const API_URL = "http://localhost:8080/api/v1/upload";
// const UPLOAD_ENDPOINT = "str";

const CreateBlog = () => {

    const [topics, setTopic] = useState([])
    const [image, setImage] = useState("")
    const [topicSelected, setTopicSelected] = useState([])

    useEffect(() => {
        getTopic()
    }, [])

    const getTopic = async () => {
        try {
            const res = await AxiosApi.getAuth(WsUrl.ADMIN_TOPIC)
            console.log("Kích cỡ: ", res)
            const { data } = res
            setTopic(data.data)
            console.log("ở đây", data.data)
        } catch (e) {
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR)

        }
    }
    const uploadImage = async e => {
        const files = e.target.files
        const data = new FormData()
        data.append('file', files[0])
        data.append("upload_preset", "gxfcbf2p")
        setLoading(true)
        const res = await fetch("https://api.cloudinary.com/v1_1/anhcoming/image/upload",
            {
                method: "POST",
                body: data
            })
        const file = await res.json()
        console.log(file)
        setImage(file.secure_url)
        setLoading(false)
    }

    const { register, handleSubmit, setValue, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)
    const handleSubmitForm = async values => {
        console.log("handleSubmitForm() start with values: ", values)
        setLoading(true)
        try {
            let payload = {
                title: values.title,
                topicId: topicSelected.value,
                image: image,
                description: values.description,
                content: editorRef.current
            }
            console.log("handleSubmitForm() payload: ", payload)
            const res = await AxiosApi.postAuth(WsUrl.ADMIN_CREATE_BLOG, payload)
            console.log("handleSubmitForm() call api res : ", res)
            if (res) {
                ToastUtils.createToast(WsToastType.SUCCESS, WsMessage.CREATED_DONE, 1000)
            }
        } catch (e) {
            console.log("handleSubmitForm() error: ", e)
            ToastUtils.createToast(WsToastType.ERROR, e.response.data.message || WsMessage.INTERNAL_SERVER_ERROR, 2000)
        } finally {
            setLoading(false)
        }
    }

    const editorRef = useRef(null);
    const reset = () => {
        setImage("")
        setTopicSelected("")
        
    }
    // ==============
    const imageUrl =
        "https://i.picsum.photos/id/566/200/300.jpg?hmac=gDpaVMLNupk7AufUDLFHttohsJ9-C17P7L-QKsVgUQU";
    const [imgUrl, setImgUrl] = useState();
    const getImg = async () => {
        const response = await fetch(imageUrl);
        const imageBlob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
            const base64data = reader.result;
            setImgUrl(base64data);
        };
    };
    useEffect(() => {
        getImg();
    }, []);
    // ===========
    // function uploadAdapter(loader) {
    //     return {
    //         upload: () => {
    //             return new Promise((resolve, reject) => {
    //                 const body = new FormData();
    //                 loader.imgUrl.then((imgUrl) => {
    //                     body.append("uploadImg", imgUrl);
    //                     body.append("uploadImg", "gxfcbf2p")
    //                     console.log(imgUrl)
    //                     fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
    //                         method: "post",
    //                         body: body
    //                     })
    //                         .then(console.log("ok"))

    //                 });
    //             });
    //         }
    //     };
    // }
    // ===
    // function uploadPlugin(editor) {
    //     editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    //         return uploadAdapter(loader);
    //     };
    // }
    //   ===================
    return (
        <div className="container-fluid w-100 reponsive">
            <form className="card shadow mb-4" onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="card-header py-3 d-flex align-items-center">
                    <Link to='/blog' className=''><i className="fa fa-arrow-left" aria-hidden="true" /></Link>
                    <span className='mx-1'></span>
                    <h3 className="m-0 font-weight-bold text-primary">Thêm mới bài viết</h3>
                </div>
                <div className="card-body d-flex justify-content-between">
                    <div className='col-8'>
                        <div className='d-flex justify-content-between'>
                            <b><label htmlFor="" className="form-label">Tiêu đề<span className='text-danger'>*</span></label></b>
                        </div>
                        <input type="input" className="form-control py-3" {...register("title")} />
                        <br />
                        <div className='d-flex justify-content-between'>
                            <b><label htmlFor="" className="form-label">Mô tả ngắn<span className='text-danger'>*</span></label></b>
                        </div>
                        <input type="input" className="form-control py-3" {...register("description")} />
                        <br />

                        <div className='d-flex justify-content-between'>
                            <b><label htmlFor="" className="form-label">Loại bài viết<span className='text-danger'>*</span></label></b>

                        </div>
                        <Select options={topics.map(o => ({ label: o.name, value: o.id }))} onChange={setTopicSelected} />
                        <br />

                    </div>
                    <div className='col-4'>
                        <div className='d-flex justify-content-between'>
                            <b><label htmlFor="" className="form-label">Ảnh đại diện<span className='text-danger'>*</span></label></b>
                        </div>
                        <input className='form-control mb-3' type="file" onChange={uploadImage} placeholder="Upload an Image"
                        />
                        {
                            loading ? (
                                <h3>Loading...</h3>
                            ) : (
                                <img src={image} style={{ height: "170px" }} />
                            )
                        }
                    </div>
                </div>

                <div className="col-12 mb-4 justify-content-between" style={{ padding: "0px 31px" }}>
                    <b><label htmlFor="" className="form-label">Nội dung<span className='text-danger'>*</span></label></b>
                    <CKEditor editor={ClassicEditor}
                        config={{
                            // extraPlugins: [uploadPlugin]
                        }}
                        data="<p>Viết gì đó nào...</p>"
                        onReady={editor => {
                            console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            console.log({ event, editor, data });
                            editorRef.current = editor.getData()
                        }}
                        onBlur={(event, editor) => {
                            console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                            console.log('Focus.', editor);
                        }}
                    />
                </div>

                <div className="card-footer d-flex justify-content-eight">
                    <button type='button' className='btn btn-primary mt-2 ml-2' onClick={reset}>Reset</button>
                    <button type='submit' className='btn btn-primary mt-2 ml-2' value={'Lưu'} >Lưu</button>

                </div>
            </form>
        </div>
    )
}

export default CreateBlog