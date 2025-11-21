import React, {useState} from 'react';
import {useDropzone} from "react-dropzone";
import Icon from "../../commonElements/icon/Icon";
import ErrorModal from "../../../modals/errorModal/ErrorModal";
import {ReactComponent as uploadIcon} from "../../../assets/cloud_upload.svg";
import "./pdfInput.scss"
import {ReactComponent as previewIcon} from "../../../assets/pdf.svg";


const PdfInput = ({
                      multiple = false,
                      formik
                  }) => {
    const [error, setError] = useState(null);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});


    const onDrop = (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            setError('Only PDF files are allowed.');
            return;
        }
        setError('');

        const file = acceptedFiles[0];
        if (file) {
            const preview = {
                fileName: file.name,
                size: file.size,
            };
            formik.setFieldValue("document", file);
            setPreviewFiles([preview]);
        }
    };

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {'application/pdf': ['.pdf']},
        multiple: {multiple},
    });

    return (
        <div className="document-upload">
            {previewFiles.length === 0 && <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="no-preview">
                    <Icon icon={uploadIcon}/>
                    <p className="text">Drag and Drop or <span className="browse">Browse</span> to upload photo</p>
                </div>
            </div>}
            <div className="preview-container">
                {previewFiles.map((preview, index) => (
                    <div key={index} className="single-iteam">
                        <Icon icon={previewIcon}/>
                        {uploadProgress[preview.name] && (
                            <div className="progress-wrapper">
                                <div className="label-box">
                                    <span className="upload-label">
                                        Uploading File... {uploadProgress[preview.name]}%
                                    </span>
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
    );
};

export default PdfInput;