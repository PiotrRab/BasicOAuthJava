import React, {useState} from 'react';
import './photoInput.scss';
import {useDropzone} from 'react-dropzone';
import * as photoActions from '../../../photos/PhotosAction';
import {ReactComponent as uploadIcon} from "../../../assets/cloud_upload.svg";
import Icon from "../../commonElements/icon/Icon";
import Button from "../../commonElements/button/Button";
import {ReactComponent as cancelIcon} from "../../../assets/reset.svg";
import ErrorModal from "../../../modals/errorModal/ErrorModal";
import {useFormik} from "formik";


const PhotoInput = ({
                        multiplePhotos = true,
                        estateId,
                        onUploadComplete
                    }) => {

    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});

    const formik = useFormik({
        initialValues: {
            photo: null
        }
    })

    const onDrop = (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            setError('Only JPG and PNG files are allowed.');
            return;
        }
        setError('');

        const newPreviews = acceptedFiles.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name
        }))

        setPreviewImage((previous) => [...previous, ...newPreviews])

        let uploadsRemaining = acceptedFiles.length;

        const checkUpload = ()=>{
            uploadsRemaining -= 1;
            if(uploadsRemaining === 0){
                onUploadComplete();
            }
        }

        acceptedFiles.forEach((file) => {
            const photoData = new FormData();
            photoData.append('file', file);
            photoData.append('estate', estateId.toString());
            photoData.append('path', file.path);
            photoData.append('name', file.name);

            const uploadTrack = file.name;
            setUploadProgress((prev) => ({...prev, [uploadTrack]: 0}));

            photoActions.createPhoto(photoData, (createdPhoto) => {
                    formik.setFieldValue('photo', createdPhoto);
                    setUploadProgress((previous) => ({...previous, [uploadTrack]: 100}))
                    setPreviewImage((prev) =>
                        prev.map((preview) =>
                            preview.name === file.name ? {...preview, id: createdPhoto.id} : preview
                        )
                    );
                    checkUpload();

                },
                (errorMessage) => {
                    setError(errorMessage);
                    setPreviewImage((previouse) => previouse.filter((preview) => preview.name !== file.name));
                },
                (percentage) => {
                    setUploadProgress((previous) => ({...previous, [uploadTrack]: percentage}))
                },
            )
        })
    };

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg']},
        multiple: {multiplePhotos},
    });

    const cancelUpload = (fileName, photoId) => {
        if (photoId) {
            photoActions.deletePhoto(photoId, () => {
                setPreviewImage((previouse) => previouse.filter(previouse => previouse.name !== fileName))
                setUploadProgress((previose) => {
                    const newProgress = {...previose}
                    delete newProgress[fileName];
                    return newProgress
                })
            })
        } else {
            setPreviewImage((previouse) => previouse.filter(previouse => previouse.name !== fileName))
            setUploadProgress((previose) => {
                const newProgress = {...previose}
                delete newProgress[fileName];
                return newProgress
            })
        }
    }

    return (
        <div className="photo-upload">
            {previewImage.length === 0 && <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="no-preview">
                    <Icon icon={uploadIcon}/>
                    <p className="text">Drag and Drop or <span className="browse">Browse</span> to upload photo</p>
                </div>
            </div>}
            <div className="preview-container">
                {previewImage.map((preview, index) => (
                    <div key={index} className="single-iteam">
                        <img src={preview.url}></img>
                        {uploadProgress[preview.name] && (
                            <div className="progress-wrapper">
                                <div className="label-box">
                                    <span
                                        className="upload-label"> Uploading File... {uploadProgress[preview.name]}%</span>
                                    <Button variant="icon" onClick={() => cancelUpload(preview.name, preview.id)}>
                                        <Icon className="cancel-upload" icon={cancelIcon}/>
                                    </Button>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: `${uploadProgress[preview.name]}%`}}></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {error &&
                <ErrorModal
                    closeModal={() => setError(null)}
                    errorMessage={error}
                />}
        </div>

    )
}

export default PhotoInput