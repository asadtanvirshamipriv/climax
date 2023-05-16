import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import SelectComp from "../../Shared/Form/SelectComp";
import InputNumComp from "./Components/Shared/Form/InputNumComp"

export default function App() {
  const { register, control, handleSubmit, reset, trigger, setError } = useForm({
    // defaultValues: {}; you can populate the fields by this attribute 
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test"
  });

  const tempTest = useWatch({ control, name: 'test' });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <SelectComp register={register} name={`test.${index}.firstName`} control={control} label='Job Type' width={"100%"} //disabled={getStatus(approved)}
              options={[
                { id: 'Direct', name: 'Direct' },
                { id: 'Coloaded', name: 'Coloaded' },
                { id: 'Cross Trade', name: 'Cross Trade' },
                { id: 'Liner Agency', name: 'Liner Agency' },
              ]} />
            <input {...register(`test.${index}.lastName`)} />
            <div style={{ backgroundColor: 'white', width: 150 }}
              onClick={() => {
                let tempState = [...tempTest];
                tempState[index].client = tempState[index].client + "clicked";
                reset({ test: tempState })
              }}
            >
              {tempTest[index].client}
            </div>
            <button type="button" onClick={() => { console.log(item.itemId); remove(index) }}>Delete</button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => append({ itemId: 12873687181, firstName: "", lastName: "" })}
      >
        append
      </button>
      <button type="button"
        onClick={() => {
          reset({
            test: [
              { itemId: 1, firstName: "Cross Trade", lastName: "1", client: "Client One" },
              { itemId: 2, firstName: "Cross Trade", lastName: "2", client: "Client Two" },
              { itemId: 3, firstName: "Cross Trade", lastName: "3", client: "Client Three" }
            ]
          })
        }}
      >Changse</button>
      <input type="submit" />
    </form>
  );
}