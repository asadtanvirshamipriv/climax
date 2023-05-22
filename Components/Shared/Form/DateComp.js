// import { Form, DatePicker } from 'antd';
// import { Controller  } from "react-hook-form";

// const DateComp = (props) => {
//   return (
//   <>
//     <Controller
//       name={`${props.name}`}
//       defaultValue=""
//       control={props.control}
//       {...props.register(`${props.name}`)}
//       render={({ field }) => (
//         <>
//           <div>{props.label}</div>
//           <DatePicker disabled={props.disabled} size={props.size} style={{minWidth:props.width}} {...field} />
//         </>
//       )}
//     />
//   </>
//   )
// }
// export default DateComp

import { DatePicker } from "antd";
import { useController } from "react-hook-form";

const NumComp = ({ control, name, label, ...rest }) => {

  const { field: { onChange, onBlur, value, name: fieldName, ref } } = useController({ control, name });

  return (
    <>
      <div>{label}</div>
      <DatePicker {...rest} name={fieldName} onChange={onChange} value={value} ref={ref} onBlur={onBlur} />
    </>
  )
}

export default NumComp