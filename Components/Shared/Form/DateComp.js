import { Form, DatePicker } from 'antd';
import { Controller  } from "react-hook-form";

const DateComp = (props) => {
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
          <DatePicker disabled={props.disabled} size={props.size} style={{minWidth:props.width}} {...field} />
        </>
      )}
    />
  </>
  )
}
export default DateComp