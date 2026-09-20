function handl_mi_rspons(response, reload = 0) {
 return (async () => {
  try {
   if (response.su == 1) {
    let t3032mp = null;
    if (response.mb != null) {
     if (response.mb.l != null) {
      const t3776mp = await dbDexieManager.insertToDexie(
       dbnm,
       "mb",
       response.mb.l,
       true,
       ["a"],
      );
     }
    }
    if (response.mi != null) {
     if (response.mi.l != null) {
      const t3776mp = await dbDexieManager.insertToDexie(
       dbnm,
       "mi",
       response.mi.l,
       true,
       ["a"],
      );
     }
    }
    if (response.r != null) {
     if (response.r.l != null) {
      const t3776mp = await dbDexieManager.insertToDexie(
       dbnm,
       "r",
       response.r.l,
       true,
       ["a"],
      );
     }
    }
    if (response.c != null) {
     if (response.c.l != null) {
      const t3776mp = await dbDexieManager.insertToDexie(
       dbnm,
       "c",
       response.c.l,
       true,
       ["a"],
      );
     }
    }
   } else {
    showMessageModal("Error", response.ms, true);
   }
  } catch (error) {
   console.error("Initialization failed:", error);
   showToast("Initialization error - please refresh");
  }
 })();
}
