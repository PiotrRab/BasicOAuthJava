import React, {useEffect, useState} from "react";
import {search} from "./SearchAction";
import "./search.scss"
import Button from "../../commonElements/button/Button";
import Icon from "../../commonElements/icon/Icon";
import {ReactComponent as searchIcon} from "../../../assets/search.svg";
import classNames from "classnames";

const Search = ({
                    placeholder = "Search...",
                    onSearchResults,
                    index,
                    className
                }) => {
    const [query, setQuery] = useState(null);

    const handleSearch = () => {
        search(index, query, onSearchResults);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            search(index, query, onSearchResults);
        }, 1000);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <div className={classNames("search-box", className)}>
            <Button variant="search" onClick={handleSearch}><Icon className="search" icon={searchIcon}/></Button>
            <input
                className="search-input"
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
};

export default Search;
