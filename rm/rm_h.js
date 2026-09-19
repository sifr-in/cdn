// admin_h.js - HT admin server response handler (bo/rm/c/r tables)
function handl_rm_rspons(response) {
  return (async () => {
    try {
      if (response.su == 1) {
        // Handle booking records (bo table)
        if (response.rb != null && response.rb.l != null) {
          await dbDexieManager.insertToDexie(dbnm, "rb", response.rb.l, true, [
            "a",
          ]);
        }
        if (response.rc != null && response.rc.l != null) {
          await dbDexieManager.insertToDexie(dbnm, "rc", response.rc.l, true, [
            "a",
          ]);
        }
        // Handle room records — keep the shared config's room list in sync
        // so admin reads (adminRoomRecords from window[my1uzr.worknOnPg].clientConfig.rm) see
        // freshly saved/updated rooms without hitting the rm table.
        if (response.rm != null && response.rm.l != null) {
          if (window[my1uzr.worknOnPg].clientConfig) window[my1uzr.worknOnPg].clientConfig.rm = response.rm.l;
          await dbDexieManager.insertToDexie(dbnm, "rm", response.rm.l, true, [
            "a",
          ]);
        }
        // Handle guest records (c table)
        if (response.c != null && response.c.l != null) {
          await dbDexieManager.insertToDexie(dbnm, "c", response.c.l, true, [
            "a",
          ]);
        }
        if (response.r != null && response.r.l != null) {
          await dbDexieManager.insertToDexie(dbnm, "r", response.r.l, true, [
            "a",
          ]);
        }
      } else {
        if (typeof showMessageModal === "function") {
          showMessageModal("Error", response.ms || "Operation failed", true);
        } else {
          alert(response.ms || "Error occurred");
        }
      }
    } catch (error) {
      console.error("Response handler error:", error);
    }
  })();
}