/*
 * Very specialized convenient functions that can't really be called 'utilities'
 * that are used by more than one files and so require a proper place to live
 *
 */

const React = require('react');

msgTreeDataIsDirty = (targetId) => {
  return (
    <div style={{width: '16em', padding: '1em'}}>
      <p>
        Τα δεδομένα του δένδρου <b><tt>{targetId}</tt></b> έχουν μεταβληθεί χωρίς να έχουν
        αποθηκευθεί.
      </p>
      <p>Ανακαλέστε την τροποποίηση ή αποθηκεύστε τα τροποποιημένα
        δεδομένα για να συνεχίσετε.
      </p>
    </div>
  );
};

function displayNotificationIfTargetIsDirty() {
  console.log(`this.props.targetIsDirty = ${this.props.targetIsDirty}`);
  if (this.props.targetIsDirty) {
    this.props.displayNotificationTargetIsDirty();
    return true;
  } else
  return false;
}


exports.msgTreeDataIsDirty = msgTreeDataIsDirty;
exports.displayNotificationIfTargetIsDirty = displayNotificationIfTargetIsDirty;
