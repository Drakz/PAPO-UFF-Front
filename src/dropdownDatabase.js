import React from "react";
import "./App.css";

import { Dropdown } from "react-bootstrap";

function DropdownDatabase(list, currentObj) {
  console.log(list);
  return (
    <Dropdown>
      <Dropdown.Toggle
        className="questionDropdown"
        caret="true"
        color="primary"
      >
        {currentObj.materia}
      </Dropdown.Toggle>
      <Dropdown.Menu className="questionDropdown" basic>
        {list ? (
          list.map((_subject) => (
            <Dropdown.Item
              onClick={() => {
                setSubject(_subject);
                getTopics(_subject.id);
              }}
            >
              {_subject.materia}
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item>Carregando...</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownDatabase;
