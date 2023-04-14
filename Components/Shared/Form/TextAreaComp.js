import { Input, Form } from "antd";
import { Controller  } from "react-hook-form";

const { TextArea } = Input;

const TextAreaComp = (props) => {

  return (
    <>
    <Controller
      name={`${props.name}`}
      defaultValue=""
      control={props.control}
      {...props.register(`${props.name}`)}
      render={({ field }) => (
          <>
            <div>{props.label}</div>
            <TextArea disabled={props.disabled} {...field} />
          </>
      )}
    />
    </>
  )
}

export default TextAreaComp
