import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useCallback } from "react";
import { CommonInputProps, useInput } from "react-admin";


export const ToggleButtonInput = (props: ToggleButtonInputProps) => {
    const {
        className,
        defaultValue = 'JOB', // Default value
        format,
        label,
        onBlur,
        onChange,
        parse,
        resource,
        source,
        validate,
        choices,
        row = false,
        sx,
        ...rest
    } = props;

    const {
        id,
        field,
        isRequired,
        fieldState: { error, invalid },
    } = useInput({
        defaultValue,
        format,
        parse,
        resource,
        source,
        onBlur,
        onChange,
        validate,
        ...rest,
    });

    const handleChange = useCallback(
        (event: any, value: any) => {
            if (value !== null) {
                field.onChange(value); // Update the field value
                field.onBlur(); // Mark the field as touched
            }
        },
        [field]
    );

    return (
        <>
            <ToggleButtonGroup
                value={field.value || defaultValue} // Default to "JOB"
                exclusive
                fullWidth
                onChange={handleChange}
                {...rest}
            >
                {choices.map(choice => (
                    <ToggleButton
                        key={choice.id}
                        value={choice.id}>
                        {choice.name}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            {invalid && (
                <div style={{ color: 'red', marginTop: '0.5rem' }}>
                    {error?.message}
                </div>
            )}
        </>
    );
};

export type ToggleButtonInputProps = CommonInputProps & {
    choices: { id: string; name: string }[]; // Array of choices for the buttons
    row?: boolean; // Whether to display buttons in a row
} & Omit<React.ComponentProps<typeof ToggleButtonGroup>, 'onChange'>;