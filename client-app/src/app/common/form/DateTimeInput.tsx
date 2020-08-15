import React from 'react';
import {Form, FormFieldProps, Label} from "semantic-ui-react";
import {FieldRenderProps} from "react-final-form";
import {DateTimePicker} from 'react-widgets';


interface IProps
    extends FieldRenderProps<Date>, FormFieldProps {
};


const DateTimeInput: React.FC<IProps> = ({
                                             input,
                                             width,
                                             placeholder,
                                             date = false,
                                             time = false,
                                             meta: {
                                                 touched,
                                                 error
                                             },
                                             id,
                                             ...rest
                                         }) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
            <DateTimePicker id={id ? id.toString() : ''}
                            placeholder={placeholder}
                            value={input.value || null}
                            onBlur={input.onBlur}
                            onChange={input.onChange}
                            onKeyDown={(e)=> e.preventDefault()}
                            date={date}
                            time={time}
                            {...rest}/>
            {touched && error && (
                <Label basic color='red'>
                    {error}
                </Label>
            )}
        </Form.Field>
    );
}


export default DateTimeInput;