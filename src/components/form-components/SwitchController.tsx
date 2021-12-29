import * as React from "react";
// form
import {Controller, Control, FieldPath} from "react-hook-form";
// @mui
import {FormControlLabel, Switch, FormControlLabelProps} from "@mui/material";

// ----------------------------------------------------------------------

interface CustomControl {
    control: Control<any>;
    name: FieldPath<any>;
}

export default function SwitchController({
                                             control,
                                             name,
                                             ...other
                                         }: CustomControl & FormControlLabelProps) {
    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({field}) => (
                    <FormControlLabel
                        control={<Switch {...field} checked={field.value as boolean}/>}
                        {...other}
                    />
                )}
            />
        </>
    );
}
