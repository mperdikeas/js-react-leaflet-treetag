/*
 * Very specialized convenient functions that can't really be called 'utilities'
 * that are used by more than one files and so require a proper place to live
 *
 */

const React = require('react');

msgTreeDataIsDirty = (targetId) => {
  return (
    <>
    <div style={{width: '18em'}}>
      Τα δεδομένα του δένδρου <b><tt>{targetId}</tt></b> έχουν μεταβληθεί χωρίς να έχουν
      αποθηκευθεί.
    </div>
    <div>Ανακαλέστε την τροποποίηση ή αποθηκεύστε τα τροποποιημένα
      δεδομένα για να συνεχίσετε.
    </div>
    </>
  );
};

exports.msgTreeDataIsDirty = msgTreeDataIsDirty;
