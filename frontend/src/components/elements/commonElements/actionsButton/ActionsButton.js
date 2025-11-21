import React from 'react';
import Button from "../button/Button";
import Icon from "../icon/Icon";
import {ReactComponent as saveIcon} from "../../../assets/check.svg";
import {ReactComponent as editIcon} from "../../../assets/edit.svg";
import {ReactComponent as deleteIcon} from "../../../assets/delete.svg";
import {ReactComponent as resetIcon} from "../../../assets/reset.svg";


const ActionsButton = ({
                           isNew,
                           editMode,
                           onSave,
                           onEdit,
                           onDelete,
                           onReset,
                           isAdd,
                           onAdd,
                           addIcon
                       }) => {
    return (
        <div className="button-container">
            {isAdd ? (
                <Button variant="add" onClick={onAdd} type="button">
                    <Icon className="add" icon={addIcon} />
                    Add
                </Button>
            ) : (
                <>
                    {isNew ? (
                        <>
                            <Button variant="delete" onClick={onReset} type="button">
                                <Icon className="delete" icon={resetIcon}/>
                            </Button>
                            <Button variant="save" onClick={onSave} type="submit">
                                <Icon className="save" icon={saveIcon}/>
                                Save
                            </Button>
                        </>
                    ) : (
                        <>
                            {!editMode ? (
                                <Button variant="edit" onClick={onEdit} type="button">
                                    <Icon className="edit" icon={editIcon}/>
                                    Edit
                                </Button>
                            ) : (
                                <>
                                    <Button variant="delete" onClick={onDelete} type="button">
                                        <Icon className="delete" icon={deleteIcon}/>
                                    </Button>
                                    <Button variant="save" onClick={onSave} type="submit">
                                        <Icon className="save" icon={saveIcon}/>
                                        Save
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ActionsButton;