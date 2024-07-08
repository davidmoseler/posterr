<<-DOC

Many ORMs implement a query interface. ActiveRecord is no exception.

ActiveRecord Queries are a useful way to provide separation of concerns without sacrificing
  performance. They are used to build a database query, step by step, in higher layers, and only
  perform the actual database query in the end.

The query interface allows us to define certain operations at the lower Data Access Layer levels,
  and make those semantic operations available to higher layers, where they can be organized
  according to business rules.

The essential aspect of the implementation of the query interface is the commutative
  composability of the operations, which is achieved by the query having methods that return
  another query with the exact same interface.

PostFeed is a query that represents the posts feed. This is the interface:

```
    def original; end; => feed
    def latest; end; => feed
    def trending; end; => feed
    def search(search_term); end; => feed
    def page(page); end; => feed
```

All the methods defined on feed return a feed, so that all operations are composable and
  commutative.

On top of that interface expected by the Service Layer, all of the ActiveRecord query methods
  are also available on feed instances.

DOC

class PostFeed
  def initialize(query)
    @query = query
  end

  def latest
    PostFeed.new @query.order(created_at: :desc)
  end

  def trending
    PostFeed.new @query.order(n_reposts: :desc)
  end

  def search(string)
    PostFeed.new @query.where(
      'content LIKE ?', "%#{ string }%"
    )
  end

  def original
    PostFeed.new @query.where(repost: false)
  end

  def execute
    @query.to_a
  end

  def method_missing(m, *args, &block)
    res = @query.send(m, *args, &block)
    if(res.is_a? ActiveRecord::Relation)
      PostFeed.new res
    else
      res
    end
  end
end