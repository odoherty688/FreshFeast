import { Alert, AlertColor, AlertTitle, Box, Collapse, IconButton } from '@mui/material';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface AlertPopupProps {
    severity: AlertColor;
    message: string;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ severity, message, open, setOpen }) => {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    let title = capitalizeFirstLetter(severity);

    const handleClose = () => {
        setOpen(false);
    };

    const handleAutoClose = () => {
        const id = setTimeout(() => {
            handleClose();
        }, 5000);
        setTimeoutId(id);
    };

    const handleCancelAutoClose = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null); // Reset timeoutId
        }
    };

    useEffect(() => {
        if (open) {
            handleAutoClose();
        } else {
            handleCancelAutoClose();
        }
    }, [open]); // Ensure useEffect runs only when the 'open' state changes

    return (
        <Box
            sx={{
                width: '100%',
                position: 'fixed',
                bottom: '-15px',
                right: '0px',
                zIndex: 2, // Adjust z-index as needed
            }}
        >
            <Collapse in={open}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                    severity={severity}
                >
                    <AlertTitle>{title}</AlertTitle>
                    {message}
                </Alert>
            </Collapse>
        </Box>
    );
}

export default AlertPopup;
