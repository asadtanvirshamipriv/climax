import { Input, Form } from "antd";
import { Controller  } from "react-hook-form";

const InputComp = (props) => {

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
            <Input disabled={props.disabled} style={{minWidth:props.width}} {...field} />
          </>
      )}
    />
    </>
  )
}

export default InputComp
