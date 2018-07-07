export default{
  data(){
    return {
      author:'duke'
    }
  },
  render(){
    return (
      <div id='footer'>
        <span>written by {this.author}</span>
      </div>
    )
  }
}