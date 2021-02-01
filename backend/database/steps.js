const fs = require("fs")

let processSteps = [
  "sheep",
  "cow",
  "cat",
  "dog",
  "pig",
]

let steps = {

  selectDB: (tag) => {
    if(tag == "animalDetect") return "animal_detect"
    if(tag == "animalBook") return "animal_book"
  },

  increment: async (tag) => {

    let step = await steps.get(tag)

    step.step++

    if(step.step == processSteps.length) {
      await steps.reset(tag)
      step.step = 0
    }
    
    await fs.writeFileSync("./step.txt", JSON.stringify(step))
    
    return {
      animal: processSteps[step.step]
    }
  },

  reset: async () => {

    await fs.writeFileSync("./step.txt", JSON.stringify({step: 0}))
  },

  get: async() => {
    let data = await fs.readFileSync("./step.txt")

    let json = JSON.parse(data)
  
    return json
  }

}

module.exports = steps
