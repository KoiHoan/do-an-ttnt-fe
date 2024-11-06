import { StepperPanel } from "primereact/stepperpanel";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeflex/primeflex.css";
export default function Step1(ref) {
  const { stepperRef } = ref;
  console.log(stepperRef);
  return (
    <StepperPanel header="Header I">
      <div className="flex flex-column h-20rem">
        <div className="card">
          <FileUpload
            name="demo[]"
            accept=".xls,.xlsx"
            maxFileSize={1000000}
            emptyTemplate={
              <p className="m-0">Drag and drop files to here to upload.</p>
            }
            customUpload
            auto
            uploadHandler={onUpload}
          />
        </div>
      </div>
      <div className="flex pt-4 justify-content-end">
        <Button
          label="Next"
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={() => stepperRef.current.nextCallback()}
        />
      </div>
    </StepperPanel>
  );
}
