const yearify = ["0", "I", "II", "III", "IV"];
const branchify = {"CS" : "Computer Science","IT" : "Information Techology","MXTC" : "Mechatronics","EXTC" : "Electronics & Telecommunication","CIVIL" : "Civil","MECH" : "Mechanical"};
const getMaterials = (title, year, branch) => {
  $.post("/api/main/get/materials",
  { title: title, year: year, branch: branch},
  (data, status) =>{
    console.log("Data: "+data+"\nStatus: "+status);
    return JSON.stringify(data)
  })
  .then(materials => {
    console.log(materials);
    if(materials.length !== 0){
      let forDifferentDiv = `<h2 class="mt-5">Trending in "${title}" from other streams:</h2><hr/>`;
      materials.forEach(material => {
        let topicsCovered = '';
        for(let i=0; i<= 3; i++){
          if(i<3){
            topicsCovered += `<li><h6>${material.contents[i].chapterName}</li></h6>`;
          }else{
            if((material.contents.length - 3) !== 0){
              topicsCovered += `+${material.contents.length - 3} more`;
            }
          }
        }
        forDifferentDiv += `<div class="row bg-light course-description containernew1 shadow" onmouseover="hovered(this)" onmouseout="removed(this)" onclick="javascript:location.href= '/material/${material._id}'">
          <div class="col-md-3 p-2" style="margin: 0px;">
            <div class="course-image">
              <img src="https://udemy-images.udemy.com/course/240x135/1638522_fbdf.jpg" alt="Course Image" style="margin: 0px;padding: 0px;width: 100%">
            </div>
          </div>
          <div class="col-md-5 p-2">
            <ul class="course-details">
              <li><h4> by</h4></li>
              <li><h6><strong>Under guidance of: </strong> ${material.guidedBy}</h6></li>
              <li><h6>By: ${material.publisher.name.first} ${material.publisher.name.last}</h6></li>
              <li><h6><strong>Branch: </strong>${branchify[material.branch]}</h6></li>
              <li><h6><strong>Year: </strong>${yearify[material.year]}</h6></li>
            </ul>
          </div>
          <div class="col-md-4 p-2">
            <ul class="course-details">
              <li><h4><u>Topics Covered:</u></h4></li>
              ${topicsCovered}
            </ul>
          </div>
        </div>`;
      })
      $('#differentMaterials').html(forDifferentDiv);
    }
  });
};