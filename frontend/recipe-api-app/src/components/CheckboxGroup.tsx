import { Paper, Typography, FormGroup, Grid, FormControlLabel, Checkbox } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';

interface CheckboxProps {
    title: string,
    bio: string,
    labels: string[];
    values: string[];
    selectedLabels: string[];
    setSelectedLabels: Dispatch<SetStateAction<string[]>>;
    xs: number;
    md: number;
  }
  
const CheckboxGroup: React.FC<CheckboxProps> = ({ title, bio, labels, values, selectedLabels, setSelectedLabels, xs, md }) => {
    const handleCheckbox = (value: string) => {
        if (selectedLabels.includes(value)) {
        // If the label is already selected, remove it
        setSelectedLabels((prevSelected) => prevSelected.filter((selectedLabel) => selectedLabel !== value));
        } else {
        // If the label is not selected, add it
        setSelectedLabels((prevSelected) => [...prevSelected, value]);
        }
    };

    return (
        <Paper sx={{padding: 2, paddingLeft: 2, paddingBottom: 2, boxShadow: 2}}>
            <Typography variant="h5" sx={{paddingBottom: 1, fontWeight: 'bold'}}>{title}</Typography>
            <Typography sx={{paddingBottom: 1}}>{bio}</Typography>
            <FormGroup>
            <Grid container spacing={0.5}>
                {labels.map((label, index) => (
                <Grid item key={label} xs={xs} md={md}>
                    <FormControlLabel
                    control={
                        <Checkbox
                        data-testid={`${label}-checkbox`}
                        checked={selectedLabels.includes(values[index])}
                        onChange={() => handleCheckbox(values[index])}
                        />
                    }
                    label={label}
                    />
                </Grid>
                ))}
            </Grid>
            </FormGroup>
        </Paper>
    );
};

export default CheckboxGroup;