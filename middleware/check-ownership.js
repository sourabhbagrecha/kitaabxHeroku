module.exports = (req, res, next) => {
  const cMaterials = req.user.createdMaterials;
  const materialId = req.params.id.toString();
  foundMaterial = cMaterials.find(element => {
    return cMaterials.toString() === materialId;
  })
  if(foundMaterial < 0){
    return res.send("Unauthorized!!");
  }
  next();
}