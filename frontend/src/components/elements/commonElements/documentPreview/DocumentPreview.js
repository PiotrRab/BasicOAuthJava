import React from 'react';
import Icon from "../icon/Icon";
import {ReactComponent as pdfIcon} from "../../../assets/pdf.svg";
import Button from "../button/Button";
import {ReactComponent as deleteIcon} from "../../../assets/delete.svg";
import {ReactComponent as downloadIcon} from "../../../assets/download.svg";
import "./documentPreview.scss"

const DocumentPreview = ({
                             name,
                             size,
                             handleDelete,
                             handleDownload
                         }) => {

    return (
        <div className="document-preview">
            <div className="document-name-box">
                <Icon className="document" icon={pdfIcon}/>
                <label>
                    {name}
                </label>
                <span>{size}kB</span>
            </div>
            <div className="button-container">
                {handleDelete &&
                    <Button variant="icon" onClick={handleDelete}>
                        <Icon icon={deleteIcon}/>
                    </Button>}
                <Button variant="icon" onClick={handleDownload}>
                    <Icon icon={downloadIcon}/>
                </Button>
            </div>
        </div>
    );
};

export default DocumentPreview;