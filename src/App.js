import React from 'react'
// import data from './data/DPR_Eateries_001.json'
import PapaParse from 'papaparse'
import data from './data/DOHMH_MenuStat.csv'
import './App.css'

const CategoryItem = ({ 
  clickHandler,
  title,
  children,
  ...rest
}) => (
  <li 
    key={title}
    onClick={() => clickHandler(title)}
    {...rest}
  >
    { children }
  </li>
)


class App extends React.Component {
  state = {
    data: null,
    categories: null,
    restaurants: null,
    currentCategory: null,
    currentRestaurant: null,
    currentItem: null
  } 

  changeCategory = category => this.setState({ 
    currentCategory: category,
    currentItem: null 
  })

  changeRestaurant = rest => this.setState({ 
    currentRestaurant: rest,
    currentItem: null 
  })

  getFoodCategories = (data) => {
    const categories = data.map( row => row.Food_Category)
    const uniqCategories = [ ...new Set(categories) ]
    return uniqCategories
  }  

  getRestaurants = (data) => {
    const restaurants = data.map( row => row.restaurant )
    const uniqRestaurants = [ ...new Set(restaurants) ]    
    return uniqRestaurants
  }

  formatData = (data) => {
    console.log(data)     
    const categories = this.getFoodCategories(data)
    const restaurants = this.getRestaurants(data)
    this.setState({ 
      data,
      categories,
      restaurants
    }) 
  }

  renderMenuItem = () => {
    const { 
      Item_Name,
      Item_Description,
      Calories,
      Carbohydrates,
      Dietary_Fiber,
      Protein,
      Saturated_Fat,
      Sodium,
      Sugar,
      Total_Fat,
      Trans_Fat
     } = this.state.currentItem

    return (
      <div className="App__menu_facts">
        <h3 style={{ borderBottom: 'solid 4px black'}}>Nutrition Facts</h3>
        <h4>{ Item_Name }</h4>
        <p>Description: <span>{ Item_Description }</span></p>
        <p>Calories     <span>{ Calories }</span></p>
        <p>Carbs        <span>{ Carbohydrates }</span></p>
        <p>Cholesterol  <span>{ Dietary_Fiber }</span></p>
        <p>Protein      <span>{ Protein }</span></p>
        <p>Fiber        <span>{ Saturated_Fat }</span></p>
        <p>Sugar        <span>{ Sodium }</span></p>
        <p>Carbs        <span>{ Sugar }</span></p>
        <p>Total Fat    <span>{ Total_Fat }</span></p>
        <p>Trans Fat    <span>{ Trans_Fat }</span></p>
      </div>
    )
  }

  renderFilteredHighlight = (data, currentCategory, currentRestaurant) => {
    const restaurantSelection = data.filter( row => row.restaurant === currentRestaurant)
    const categorySelection = restaurantSelection.filter( row => row.Food_Category === currentCategory)

    if (categorySelection.length === 0) return <p>Nothing here!</p>

    return categorySelection.map( item => (
      <li 
        className="App__menu_item" 
        key={item.Item_Name}
        onClick={ () => this.setState({ currentItem: item }) }
      >
        {item.Item_Name}
      </li>
    ))
  }

  renderHighlight = () => {
    const { currentCategory, currentRestaurant, data } = this.state

    if (!currentCategory && !currentRestaurant) return (
      <h3>Choose a category and restaurant filter to get started.</h3>
    )

    if (!currentCategory) return (
      <h3>Choose a category to filter by.</h3>
    )
    
    if (!currentRestaurant) return (
      <h3>Choose a restaurant to filter by.</h3>
    )

    return this.renderFilteredHighlight(data, currentCategory, currentRestaurant)
  }

  async componentDidMount(){
    PapaParse.parse(data, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (results) => { 
        this.formatData(results.data.filter( row => row.Year === '2018'))
      }   
    })
  }

  render(){
    return (
      <div className="App">
        <h1 className="App__title">Know Your Food 🍔!</h1>
        <div className="App__description">
          Finding healthy food is hard. Sometimes we just settle for what's available.
          That doesn't mean you shouldn't know what's going into your body. The Know Your Food
          app is here to arm you with all the nutritional facts you need to keep your diet in check.
          All data is pulled from the MenuStat.org interactive online database. Pick a food 
          category and restaurant to get started. 
        </div>
        <div className="App__filters">
          {
            this.state.currentCategory && (
              <div className="App__current_category">
                { this.state.currentCategory }
                <span onClick={ () => this.setState({ currentCategory: null, currentItem: null })}>X</span>
              </div>
            )
          }
          {
            this.state.currentRestaurant && (
              <div className="App__current_restaurant">
                { this.state.currentRestaurant }
                <span onClick={ () => this.setState({ currentRestaurant: null, currentItem: null })}>X</span>
              </div>
            )
          }          
        </div>

        <div className="App__highlight">
          <h2>Menu</h2>
          <div className="App__menu">
          <div>
            <ul className="App__menu_items">
              {
                this.renderHighlight()
              }
            </ul>
          </div>
          <div>
            {
              this.state.currentItem && this.renderMenuItem()
            }
          </div>
          </div>
        </div>

        <div className="App__food_categories">
          <h3>Food Categories</h3>
          <ul>
            {
              this.state.categories && 
              this.state.categories.map( cat => (
                <CategoryItem 
                  key={cat}
                  title={cat}
                  clickHandler={this.changeCategory}
                >
                  { cat }
                </CategoryItem> 
              ))
            }
          </ul>
        </div>

        <div className="App__restaurants">
          <h3>Restaurants</h3>
          <ul>
            {
              this.state.restaurants && false &&
              this.state.restaurants.map( rest => <li key={rest}>{ rest }</li>)
            }
            {
              this.state.restaurants && 
              this.state.restaurants.map( rest => (
                <CategoryItem 
                  key={rest}
                  title={rest}
                  clickHandler={this.changeRestaurant}
                >
                  { rest }
                </CategoryItem> 
              ))
            }            
          </ul>
        </div>
      </div>
    )
  }
}

export default App
