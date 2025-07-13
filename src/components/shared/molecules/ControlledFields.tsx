import {
  FormControl,
  FormLabel,
  TextField,
  TextFieldProps,
} from "@mui/material";
import {
  Controller,
  Control,
  Path,
  RegisterOptions,
  FieldValues,
} from "react-hook-form";

type LabelConfig = {
  text: string;
  bold?: boolean;
};

type ControlledTextInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: LabelConfig;
  type?: string;
  rules?: RegisterOptions<T, Path<T>>;
  placeholder?: string;
  defaultValue?: T[Path<T>];
  fullWidth?: boolean;
} & Omit<TextFieldProps, "name" | "control" | "label">;

export function ControlledTextInput<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  rules,
  placeholder = "",
  defaultValue,
  fullWidth = true,
  onChange,
  ...textFieldProps
}: ControlledTextInputProps<T>) {
  const { text, bold = true } = label;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FormControl fullWidth={fullWidth}>
          <FormLabel
            htmlFor={name}
            sx={{
              fontSize: "1rem",
              fontWeight: bold ? "bold" : "normal",
            }}
          >
            {text}
          </FormLabel>
          <TextField
            {...field}
            id={name}
            type={type}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            placeholder={placeholder}
            variant="outlined"
            color={fieldState.error ? "error" : "primary"}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e);
            }}
            {...textFieldProps}
          />
        </FormControl>
      )}
    />
  );
}
