import React, { useRef, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeflex/primeflex.css";
const BASE_URL = "http://localhost:3000";
export default function Home() {
  const stepperRef = useRef(null);
  const [templateAtributes, setTemplateAtributes] = useState([]);
  const [requestAtributes, setRequestAtributes] = useState([]);
  const [criteriaAtributes, setCriteriaAtributes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [tableData, setTableData] = useState([]);
  const [mail, setMail] = useState("");

  const opeOptions = ["Chứa", "Không chứa"];
  const [opeValue, setOpeValue] = useState(opeOptions[0]);

  const fetchFileAttributes = async (file_name) => {
    try {
      const response = await fetch(
        `http://localhost:3000/file/get-attributes?fileName=${file_name}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch file attributes");
      }

      const data = await response.json();
      setTemplateAtributes(data["data"]); // Save the file attributes
      // console.log("File attributes:", templateAtributes);
    } catch (err) {
      console.error(err);
    }
  };
  const handleFilter = async () => {
    // todo dynamic filename
    const fileName = "data.xlsx"; // File name parameter
    // const url = `http://localhost:3000/file/filter?fileName=${fileName}`; // Query parameter
    const url = "http://localhost:3000/file/filter?fileName=data.xlsx";
    // Data for the body (filterDto)
    const bodyData = {
      attributes: requestAtributes,
      criterias: criteriaAtributes.map((item) => {
        return {
          ...item,
          value: keyword,
        };
      }),

      email: "example@example.com",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        const result = await response.json();
        setTableData(convertData(result["data"]));
        return;
      } else {
        console.error("Lỗi API:", response.status);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };
  const convertAtributes = (data) => {
    data = data.map((item, index) => {
      return {
        index,
        key: item,
      };
    });
    // console.log(data);
    return data;
  };
  const handleSendMail = async () => {
    const url = "http://localhost:3000/mail/send"; // API endpoint
    const bodyData = {
      email: "khoi08022004@gmail.com", // Email in the request body
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Setting the content type to JSON
        },
        body: JSON.stringify(bodyData), // Convert bodyData to JSON string
      });

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        console.log("Email sent successfully:", data);
        return data;
      } else {
        console.error("Error in API request:", response.status);
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };
  const convertData = (data) => {
    const result = [];

    data.forEach((hoidong) => {
      const tenHoiDong = hoidong.tenHoiDong;

      hoidong.danhSachDeTai.forEach((detai) => {
        result.push({
          ...detai,
          tenHoiDong: tenHoiDong,
        });
      });
    });

    return result;
  };
  const headerTemplate = (data) => {
    return (
      <div className="flex align-items-center gap-2">
        <span className="font-bold">{data.tenHoiDong}</span>
      </div>
    );
  };
  return (
    <div className="m-5">
      <div className="flex justify-content-center border-2 border-dashed surface-border border-round">
        <Stepper ref={stepperRef} style={{ flexBasis: "85rem" }} linear>
          {/* step 1 */}
          <StepperPanel header="Tải lên file">
            <div className="flex flex-column h-20rem">
              <div className="card">
                <FileUpload
                  name="file"
                  accept=".xlsx,.xls"
                  url={`${BASE_URL}/file/upload`}
                  maxFileSize={1000000}
                  emptyTemplate={
                    <p className="m-0">
                      Drag and drop files to here to upload.
                    </p>
                  }
                  onUpload={(files, xhr) => {
                    const name = files.files[0].name;
                    console.log(name);
                    fetchFileAttributes(name);
                  }}
                  // customUpload
                  // auto
                  // uploadHandler={onUpload} // Custom upload handler
                />
              </div>
            </div>
            <div className="flex pt-4 justify-content-end">
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => {
                  stepperRef.current.nextCallback();
                }}
              />
            </div>
          </StepperPanel>
          {/* step 2 */}
          <StepperPanel header="Lọc trường">
            <div className="flex flex-column min-h-20rem">
              <div className="grid">
                <div className="col">
                  <div className="card ">
                    <MultiSelect
                      value={requestAtributes}
                      onChange={(e) => setRequestAtributes(e.value)}
                      options={convertAtributes(templateAtributes)}
                      optionLabel="key"
                      filter
                      placeholder="Chọn trường hiển thị"
                      maxSelectedLabels={3}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="card ">
                    <MultiSelect
                      value={criteriaAtributes}
                      onChange={(e) => setCriteriaAtributes(e.value)}
                      options={convertAtributes(templateAtributes)}
                      optionLabel="key"
                      filter
                      placeholder="Chọn trường cần lọc"
                      maxSelectedLabels={3}
                      className="w-full"
                    />
                  </div>
                  <div className="card">
                    <div className="p-inputgroup">
                      <SelectButton
                        value={opeValue}
                        onChange={(e) => setOpeValue(e.value)}
                        options={opeOptions}
                      />
                      <InputText
                        placeholder="Keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card max-h-30rem overflow-auto">
                <DataTable
                  value={tableData}
                  rowGroupMode="subheader"
                  groupRowsBy="tenHoiDong"
                  scrollable
                  scrollHeight="400px"
                  rowGroupHeaderTemplate={headerTemplate}
                  tableStyle={{ minWidth: "50rem" }}
                >
                  {requestAtributes.map((item, index) => {
                    return (
                      <Column key={index} field={item.key} header={item.key} />
                    );
                  })}{" "}
                </DataTable>
              </div>
            </div>

            <div className="flex pt-4 justify-content-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current.prevCallback()}
              />
              <Button
                label="Xem trước"
                onClick={() => {
                  handleFilter();
                  console.log(tableData);
                }}
              ></Button>
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => stepperRef.current.nextCallback()}
              />
            </div>
          </StepperPanel>

          {/* step 3 */}
          <StepperPanel header="Gửi email">
            <div className="flex flex-column h-20rem">
              <div className="card">
                <h2>Nhập email muốn gửi</h2>
                <label htmlFor="email" className="p-sr-only">
                  Firstname
                </label>
                <InputText
                  id="email"
                  type="text"
                  placeholder="example@mail.com"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                />
                <Button label="Gửi" onClick={handleSendMail}></Button>
              </div>
            </div>
            <div className="flex pt-4 justify-content-start">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => stepperRef.current.prevCallback()}
              />
            </div>
          </StepperPanel>
        </Stepper>
      </div>
    </div>
  );
}
