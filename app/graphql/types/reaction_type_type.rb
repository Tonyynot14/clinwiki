module Types
  class ReactionType < BaseObject
    field :id, Int, "Id", null: false
    field :name, String,"Name of reaction example is like or dislike", null:false
  end
end
