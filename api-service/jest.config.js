module.exports = {
  preset: '@shelf/jest-dynamodb',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
  // globals: {
  //   'ts-jest': {
  //     diagnostics: false
  //   }
  // }
}
