import { Checkbox } from "antd";
import { Controller } from "react-hook-form";

const CheckGroupComp = (props) => {
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
            <Checkbox.Group 
                {...field}
                disabled={props.disabled}
                options={props.options}
            />
            </>
            )
        }
      />
    </>
  )
}

export default CheckGroupComp