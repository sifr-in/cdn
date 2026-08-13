function handl_ks_rspons(response) {
  return (async () => {
    try {
      if (response.su == 1) {
        // Handle contact/member data (c table)
        if (response.c != null && response.c.l != null) {
          await dbDexieManager.insertToDexie(dbnm, "c", response.c.l, true, [
            "a",
          ]);
        }
        // Handle case records (cs table)
        if (response.cs != null && response.cs.l != null) {
          await dbDexieManager.insertToDexie(dbnm, "cs", response.cs.l, true, [
            "a",
          ]);
        }
        // Handle E-Court case records (cs91 table)
        if (response.cs91 != null && response.cs91.l != null) {
          await dbDexieManager.insertToDexie(dbnm, "cs91", response.cs91.l, true, [
            "a",
          ]);
        }
        // Handle next date records (nd table)
        if (response.a != null && response.a.l != null) {
          await dbDexieManager.insertToDexie(dbnm, "a", response.a.l, true, [
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
