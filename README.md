# Housify
Housify is a serverless web application that provides recommendations for users when booking accommodations on Airbnb. The application mainly implements three handy features: house listings, make rating and comments, and personalized recommendation. Cloud technologies utilized in this project include but not limited to DynamoDB, API Gateway, and Lambda Functions. Collaborative filtering and K Nearest Neighbor are the two underlying core algorithms for our recommendation engine.

![Architecture](https://github.com/CCProjectGroup8/Housify/blob/master/Housify%20Architecture.png)

In general, Housify provides three powerful functionalities for users, including House Lists, Rating and Comment, and Personalized Recommendation.

* HouseLists

When a user login for the first time, the user would be asked to add some information about himself such as name, address, sex and job, etc. After input these information, the user would be able to see the recommendation list for him after a complete loop of our data transaction.

The user can view the provided houses. Specifically, two options are provided. One is to view all the houses that rating by all the people, the other option is to view the houses that recommended just for him. In other words, the user can view all the high-rank houses, or the houses just suit him.

* RatingandComment

The favorite list can be beneficial in two ways. One is for the user to have a chance to review the house, the other is for the recommender system.

When the user clicks into the detailed houses page, the user can view some detailed content. If the user input some comment and pick the rating stars, the user can also click view the other houses and goes to the original website to view the whole house list.

The most important part of Rating and Comment is to provide data for recommender system. The detailed algorithm will be discussed in the following section.

* Personalized Recommendation

After users complete their profile and make comments on our website, our website can recommend houses in our database according to these information.

The recommendation can be divided into two categories: for the old users who have made comments and ratings and have view histories on our website, we convert these three parts into one unified rating and input the final rating into our Collaborative Filtering model, which will our put the recommended houses and recomendation scores for this user; for the new users who do not have and activities on our website, we use k Nearest Neighbor model to find the most similar user in our database according to their user profile, such as budget, age, job, preference, etc,. And we can recommend houses based on Collaborative Filtering results of this nearest user.

By these two means we can make best of users information that are available to us and make proper house recommendation based on that.
