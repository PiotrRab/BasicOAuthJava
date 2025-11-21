import React from 'react';
import Icon from "../icon/Icon";
import Button from "../button/Button";
import {ReactComponent as editIcon} from "../../../assets/edit.svg";
import "./optionsRow.scss"
import {ReactComponent as deleteIcon} from "../../../assets/delete.svg";
import classNames from "classnames";

const OptionsRow = ({
                        onEdit,
                        onDelete,
                        children,
                        className
                    }) => {
    return (
        <div className={classNames('options', className)}>
            {onEdit &&
                <Button variant="edit" onClick={onEdit} type='button'>
                    <Icon className="edit" icon={editIcon}/>
                </Button>
            }
            {onDelete &&
                <Button variant="delete" onClick={onDelete} type='button'>
                    <Icon className="delete" icon={deleteIcon}/>
                </Button>
            }
            {children}
        </div>
    );
};

export default OptionsRow;