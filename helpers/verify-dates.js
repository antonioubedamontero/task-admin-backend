const verifyDates = (req, res) => {
  const i18n = req.t;

  return new Promise((resolve, reject) => {
    try {
      const { startDate, dueDate } = req.body;

      if (!startDate || !dueDate) {
        return reject(
          res.status(400).json({
            message: i18n("requiredFieldsErrors.datesModificationRequired"),
          })
        );
      }

      const startDateAsDate = new Date(startDate);
      const dueDateAsDate = new Date(dueDate);

      if (startDateAsDate > dueDateAsDate) {
        return reject(
          res.status(400).json({
            message: i18n("requiredFieldsErrors.startDateGreaterThanEndDate"),
          })
        );
      }

      resolve("ok");
    } catch (error) {
      console.error("Error verifying dates:", error);
      reject(
        res
          .status(500)
          .json({ message: i18n("catchedErrors.internalServerError") })
      );
    }
  });
};

module.exports = verifyDates;
