import React, {useEffect, useMemo, useState} from 'react';
import {DELETE, GET} from "../../appConfig/Endpoint";
import Table from "../../components/elements/common/table/Table";
import Card from "../../components/layouts/card/Card";
import Button from "../../components/elements/common/button/Button";
import CardHeader from "../../components/layouts/card/CardHeader";
import TagEditModal from "./TagEditModal";
import './tags-list.scss';

const TagsList = () => {
    const [tags, setTags] = useState([])
    const [tagModal, setTagModal] = useState(null)

    const actions = {
        getTags: () => GET('/tags', null, {}, data => setTags(data)),
        deleteTag: (id) => DELETE('/tags', id, () => actions.getTags())
    }

    useEffect(() => actions.getTags(), [tagModal])

    const columns = useMemo(() => [
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            accessor: 'id',
            columnClass: 'actions',
            Cell: ({row}) => <div className="button-container">
                <Button onClick={() => setTagModal(row.original)} className="edit">Edit</Button>
                <Button onClick={() => actions.deleteTag(row.original.id)} className="delete">Delete</Button>
            </div>
        }
    ], [tags]);

    return (
        <Card className="tags-list">
            <CardHeader title="Tags" subtitle="All your labels" className="dashboard">
                <Button onClick={() => setTagModal(true)} className="add">Add Tag</Button>
            </CardHeader>
            <Table
                columns={columns}
                data={tags}
            />
            {tagModal &&
                <TagEditModal
                    tag={tagModal}
                    onClose={() => setTagModal(null)}
                />
            }
        </Card>
    );
};

export default TagsList;
