import pc from 'picocolors'

export const logger = {
  red: (a: string) => console.log(pc.bgBlack(pc.red(a))),
  white: (a: string) => console.log(pc.bgBlack(pc.white(a))),
  green: (a: string) => console.log(pc.bgBlack(pc.green(a)))
}
