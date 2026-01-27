const editDataValidator = async (req, res) => {
  const allowedFields = ["name", "age", "skills", "about", "gender"];
  const isValid = Object.keys(req.body).every((field) => {
    return allowedFields.includes(field);
  });
  return isValid;
};

export { editDataValidator };
