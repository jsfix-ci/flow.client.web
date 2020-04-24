import React from "react";
import PropTypes from "prop-types";
import { ComposedModal, Button, TooltipDefinition } from "@boomerang/carbon-addons-boomerang-react";
import TemplateConfigModalContent from "./TemplateConfigModalContent";
import { Add16, Edit16 } from "@carbon/icons-react";
// import styles from "./TemplateConfigModal.module.scss";

TemplateConfigModal.propTypes = {
  field: PropTypes.object,
  isEdit: PropTypes.bool.isRequired,
  templateFields: PropTypes.array,
  fieldKeys: PropTypes.array
};

export function TemplateConfigModal(props) {
  const { isEdit, oldVersion, isActive } = props;
  const editTrigger = ({ openModal }) => {
    let output = null;
    isEdit
      ? (output = (
          <TooltipDefinition direction="bottom" tooltipText={"Edit field"}>
            <Button
              renderIcon={Edit16}
              kind="ghost"
              size="field"
              onClick={openModal}
              disabled={oldVersion || !isActive}
            />
          </TooltipDefinition>
        ))
      : (output = (
          <TooltipDefinition direction="top" tooltipText={"Add a new field for this task"}>
            <Button renderIcon={Add16} kind="ghost" size="field" onClick={openModal} disabled={oldVersion || !isActive}>
              Add a field
            </Button>
          </TooltipDefinition>
        ));
    return output;
  };
  return (
    <ComposedModal
      confirmModalProps={{
        title: "Are you sure?",
        children: "Your field will not be saved"
      }}
      modalHeaderProps={{
        title: isEdit ? "Edit field" : "Create field"
      }}
      modalTrigger={editTrigger}
    >
      {({ closeModal, setShouldConfirmModalClose, forceCloseModal }) => (
        <TemplateConfigModalContent
          {...props}
          closeModal={closeModal}
          setShouldConfirmModalClose={setShouldConfirmModalClose}
          forceCloseModal={forceCloseModal}
        />
      )}
    </ComposedModal>
  );
}

export default TemplateConfigModal;
