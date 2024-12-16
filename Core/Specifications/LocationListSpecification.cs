using Core.Entities;

namespace Core.Specifications;

public class LocationListSpecification : BaseSpecification<Advertisement, string>
{
    public LocationListSpecification()
    {
        AddSelect(x => x.Location);
        ApplyDistinct();
    }
}
