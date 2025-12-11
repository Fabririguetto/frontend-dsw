import React from 'react';
import { IconButton } from '@mui/material';
import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    LastPage as LastPageIcon
} from '@mui/icons-material';

const TablePaginationActions = (props) => {
    const { count, page, rowsPerPage, onPageChange } = props;

const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
};

const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
};

const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
};

const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
};

return (
    <div style={{ flexShrink: 0, marginLeft: 20 }}>
        <IconButton 
        onClick={handleFirstPageButtonClick} 
        disabled={page === 0} 
        aria-label="primera página"
        size="large"
        >
        <FirstPageIcon />
    </IconButton>
    <IconButton 
        onClick={handleBackButtonClick} 
        disabled={page === 0} 
        aria-label="página anterior"
        size="large"
    >
        <KeyboardArrowLeftIcon />
    </IconButton>
    <IconButton 
        onClick={handleNextButtonClick} 
        disabled={page >= Math.ceil(count / rowsPerPage) - 1} 
        aria-label="página siguiente"
        size="large"
    >
        <KeyboardArrowRightIcon />
    </IconButton>
    <IconButton 
        onClick={handleLastPageButtonClick} 
        disabled={page >= Math.ceil(count / rowsPerPage) - 1} 
        aria-label="última página"
        size="large"
    >
        <LastPageIcon />
        </IconButton>
    </div>
);
};

export default TablePaginationActions;