import React from 'react';
import Search from '../../inputComponents/search/Search';
import classNames from "classnames";
import "./filterBar.scss";

const FilterBar = ({
                       classname,
                       onSearchResults,
                       showArchived,
                       onChange,
                       fields,
                       index,
                       placeholder,
                   }) => {
    return (
        <div className={classNames("filter-bar", classname)}>
            <Search
                field={fields}
                index={index}
                placeholder={placeholder}
                onSearchResults={onSearchResults}
            />
            <div className="archived">
                <label>Show archived</label>
                <input
                    type="checkbox"
                    name="showArchived"
                    checked={showArchived}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default FilterBar;