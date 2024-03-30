import { useContext, useEffect, useState } from 'react';
import { IDataTableInventorySearchable, IInventoryItem } from 'components/interfaces';
import { usePrevious } from 'hooks/usePrevious';
import DataTableInventory from 'components/tables/DataTableInventory';
import { Typography } from '@mui/material';
import ErrorInformation from 'components/layout/ErrorInformation';
import { UserContext } from '../../../pages/_app';

export default function DataTableInventorySearchable(props: IDataTableInventorySearchable) {
    const { getSearchUrl, isShowSwitchAndLegend } = props;
    const { isAdminModeActivated } = useContext(UserContext);

    const [items, setItems] = useState<IInventoryItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [search, setSearch] = useState('');
    const [isFirstSearch, setIsFirstSearch] = useState(true);
    const [isNoData, setIsNoData] = useState(false);
    const [isServerError, setIsServerError] = useState(false);
    const prevSearch = usePrevious(search);
    const prevAdminMode = usePrevious(isAdminModeActivated);

    useEffect(() => {
        if (search != prevSearch || isAdminModeActivated != prevAdminMode) {
            setIsSearching(true);
            searchItems();
        }
    });

    const handleError = (error: any) => {
        console.log(error);
        setIsServerError(true);
        setIsSearching(false);
    };

    const searchItems = () => {
        fetch(getSearchUrl(search), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                if (response.ok) {
                    response
                        .json()
                        .then((result) => {
                            setIsSearching(false);
                            setItems(result);
                            if (isFirstSearch) {
                                setIsFirstSearch(false);
                                setIsNoData(result.length == 0);
                            }
                        })
                        .catch((error) => {
                            handleError(error);
                        });
                } else {
                    handleError(response);
                }
            })
            .catch((error) => {
                handleError(error);
            });
    };

    return (
        <>
            {isServerError ? (
                <ErrorInformation />
            ) : isNoData ? (
                <Typography
                    align="center"
                    marginBottom="3em"
                >
                    Es wurden noch keine Gegenstände erfasst.
                </Typography>
            ) : (
                <DataTableInventory
                    items={items}
                    search={search}
                    setSearch={setSearch}
                    isSearching={isSearching}
                    isShowSearchBar={true}
                    isShowSwitchAndLegend={isShowSwitchAndLegend}
                />
            )}
        </>
    );
}
