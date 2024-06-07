const searchBox=document.querySelector('.searchBox');
const searchBtn=document.querySelector('.searchBtn');
const recipeContainer=document.querySelector('.recipe-container');
const recipeDetails=document.querySelector('.recipe-details');

const fetchRecipes=async(query) => {

    const response=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data=await response.json();
    recipeContainer.innerHTML = "";
    if (data.meals===null) {
        recipeContainer.innerHTML="<p>no found</p>";
        return;
    }
    data.meals.forEach(meal=>{
        const recipeDiv=document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
        `;
        recipeDiv.addEventListener('click', () => {
            viewRecipe(meal);
        });

        recipeContainer.appendChild(recipeDiv);
    });
};

const viewRecipe=async (meal) => {
    const response=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
    const data=await response.json();
    const detailedMeal=data.meals[0];

    recipeContainer.innerHTML = `
        <div class="recipe-details">
            <h2>${detailedMeal.strMeal}</h2>
            <img src="${detailedMeal.strMealThumb}" alt="${detailedMeal.strMeal}">
            <h3>Ingredients</h3>
            <ul>
                ${getIngredients(detailedMeal).map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <button class="back-btn">Back</button>
        </div>
    `;

    const backBtn=document.querySelector('.back-btn');
    backBtn.addEventListener('click', () => {
        fetchRecipes(searchBox.value.trim());
    });
};

const getIngredients=(meal)=>{
    const ingredients=[];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    return ingredients;
};

searchBtn.addEventListener('click',(event) => {
    event.preventDefault();
    const searchInput=searchBox.value.trim();
    fetchRecipes(searchInput);
});