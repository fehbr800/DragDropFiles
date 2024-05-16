import { Dialog } from "./Dialog";
import SignatureCanvas from "react-signature-canvas";
import { ConfirmOrCancel } from "./ConfirmOrCancel";

import { useRef } from "react";

export function AddSigDialog({ onConfirm, onClose, autoDate, setAutoDate }) {
  const sigRef = useRef(null);


  return (
    <Dialog
      isVisible={true}
      title={"Add signature"}
      body={
        <div style={styles.container}>
          <div style={styles.sigContainer}>
            <div style={styles.sigBlock}>
              <SignatureCanvas
                velocityFilterWeight={1}
                ref={sigRef}
                canvasProps={{
                  width: "600",
                  height: 200,
                  className: "sigCanvas",
                }}
              />
            </div>
          </div>
          <div style={styles.instructionsContainer}>
            <div style={styles.instructions}>
              <div>
                Auto date/time{" "}
                <input
                  type={"checkbox"}
                  checked={autoDate}
                  onChange={(e) => setAutoDate(e.target.checked)}
                />
              </div>
              <div>Draw your signature above</div>
            </div>
          </div>

          <ConfirmOrCancel
            onCancel={onClose}
            onConfirm={() => {
              const sigURL = sigRef.current.toDataURL();
              onConfirm(sigURL);
            }}
          />
        </div>
      }
    />
  );
}
