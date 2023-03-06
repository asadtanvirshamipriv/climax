import { Select } from "antd";
import { Controller } from "react-hook-form";

const SelectComp = (props) => {
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
          <Select disabled={props.disabled} style={{minWidth:props.width}} 
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
            }
            {...field}
          >
            {
              props.options.map((x, index) => {
                return(
                  <Select.Option key={index} value={x.id}>{x.name}</Select.Option>
                )
              })
            }
          </Select>
        </>
      )}
    />
    </>
  )
}

export default SelectComp