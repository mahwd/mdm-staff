import React, {useEffect, useState, FC} from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {FormInputProps} from "./FormInputProps";


export const FormInputCheckbox: FC<FormInputProps> = ({name, label}) => {

    const {control} = useForm()
    const [value, setValue] = useState(false);

    useEffect(() => {
        setValue(value);
    }, [value]);

    return (
        <FormControl size={"small"} variant={"outlined"}>
            {/*<FormLabel component="legend">{label}</FormLabel>*/}
            <div>

                <FormControlLabel
                    sx={{color: "text.primary", mx:1}}
                    control={
                        <Controller
                            name={name}
                            render={({
                                         field: {onChange, value},
                                         fieldState: {error},
                                         formState
                                     }) => {
                                return (
                                    <Checkbox
                                        checked={value}
                                        onChange={onChange}
                                        sx={{color: "text.primary"}}
                                    />
                                );
                            }}
                            control={control}
                        />
                    }
                    label={label}
                />

            </div>
        </FormControl>
    );
};
