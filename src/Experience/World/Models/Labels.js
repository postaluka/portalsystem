import { Text } from 'troika-three-text'

export default class Labels
{
  constructor()
  {
    this.leo = this.create("LEO")
    this.meo = this.create("MEO")
    this.geo = this.create("GEO")
  }

  create(text)
  {
    const label = new Text()
    label.text = text
    label.fontSize = 0.3
    label.color = 0x050505
    label.anchorX = 'center'
    label.anchorY = 'middle'
    label.position.set(0, 0.35, 0) // трохи над квадратом
    label.letterSpacing = 0.6
    label.sync() // обовʼязково!
    return label
  }
}